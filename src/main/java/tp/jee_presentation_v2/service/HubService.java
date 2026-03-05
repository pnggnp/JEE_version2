package tp.jee_presentation_v2.service;

import jakarta.annotation.Resource;
import jakarta.enterprise.concurrent.ManagedExecutorService;
import jakarta.enterprise.context.ApplicationScoped;
import tp.jee_presentation_v2.dto.TaskResult;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@ApplicationScoped
public class HubService {

    @Resource
    private ManagedExecutorService executor;

    public TaskResult processTask(String taskName) {
        Future<TaskResult> future = executor.submit(() -> {
            try {
                // Simulate some work
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return new TaskResult(taskName, Thread.currentThread().getName(), "COMPLETED");
        });

        try {
            return future.get();
        } catch (InterruptedException | ExecutionException e) {
            return new TaskResult(taskName, "ERROR", e.getMessage());
        }
    }
}
