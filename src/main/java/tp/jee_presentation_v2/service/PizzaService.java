package tp.jee_presentation_v2.service;

import jakarta.annotation.Resource;
import jakarta.enterprise.concurrent.ManagedExecutorService;
import jakarta.enterprise.context.ApplicationScoped;
import tp.jee_presentation_v2.dto.TaskResult;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@ApplicationScoped
public class PizzaService {

    @Resource
    private ManagedExecutorService executor;

    public List<TaskResult> orderPizza(String customerName) {
        List<TaskResult> results = new ArrayList<>();

        // 1. Save (Sync)
        results.add(new TaskResult("Save Order", Thread.currentThread().getName(), "SYNC_COMPLETED"));

        // 2. Async Tasks
        Callable<TaskResult> emailTask = () -> {
            Thread.sleep(400);
            return new TaskResult("Send Email (" + customerName + ")", Thread.currentThread().getName(),
                    "ASYNC_COMPLETED");
        };
        Callable<TaskResult> pushTask = () -> {
            Thread.sleep(800);
            return new TaskResult("Push Notification (" + customerName + ")", Thread.currentThread().getName(),
                    "ASYNC_COMPLETED");
        };
        Callable<TaskResult> kitchenTask = () -> {
            Thread.sleep(1200);
            return new TaskResult("Notify Kitchen (" + customerName + ")", Thread.currentThread().getName(),
                    "ASYNC_COMPLETED");
        };

        try {
            List<Future<TaskResult>> futures = executor.invokeAll(List.of(emailTask, pushTask, kitchenTask));
            for (Future<TaskResult> f : futures) {
                results.add(f.get());
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
        }

        return results;
    }
}
