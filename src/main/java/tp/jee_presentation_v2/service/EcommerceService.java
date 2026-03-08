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
public class EcommerceService {

    @Resource
    private ManagedExecutorService executor;

    public List<TaskResult> processBatch(String jobName, int load) {
        List<Callable<TaskResult>> tasks = new ArrayList<>();
        String[] workerNames = {"inventory", "billing", "shipping", "email"};

        // Create a task for each requested worker
        for (int i = 0; i < Math.min(load, workerNames.length); i++) {
            final String workerId = workerNames[i];
            final int workerNum = i + 1;

            tasks.add(() -> {
                // Simulate heavy batch processing time
                long processTime = (long) (2500 + Math.random() * 2000);
                Thread.sleep(processTime);

                return new TaskResult(
                        workerId,
                        Thread.currentThread().getName(),
                        "Worker " + workerNum + " DONE"
                );
            });
        }

        List<TaskResult> results = new ArrayList<>();
        try {
            // Submit all chunks to the managed pool simultaneously
            List<Future<TaskResult>> futures = executor.invokeAll(tasks);
            for (Future<TaskResult> f : futures) {
                results.add(f.get());
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
        }

        return results;
    }
}