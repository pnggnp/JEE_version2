package tp.jee_presentation_v2.service;

import jakarta.annotation.Resource;
import jakarta.enterprise.concurrent.ContextService;
import jakarta.enterprise.concurrent.ManagedThreadFactory;
import jakarta.enterprise.context.ApplicationScoped;
import tp.jee_presentation_v2.dto.TaskResult;

import java.util.concurrent.Callable;

@ApplicationScoped
public class ContextDemoService {

    @Resource
    private ContextService contextService;

    @Resource
    private ManagedThreadFactory threadFactory;

    public TaskResult runWithContext(String user, String role) {
        Callable<String> task = () -> {
            return "Executed in thread: " + Thread.currentThread().getName() + " user: " + user;
        };

        try {
            if (contextService != null) {
                Callable<String> contextualTask = contextService.contextualCallable(task);
                // We're returning the status to the frontend
                return new TaskResult("ContextProxy", "Proxied Object Created", "SUCCESS");
            }
        } catch (Exception e) {
        }

        return new TaskResult("ContextProxy", "No ContextService detected", "FAILED");
    }

    public TaskResult runWithThreadFactory() {
        if (threadFactory != null) {
            Thread t = threadFactory.newThread(() -> {
                // Background work
            });
            return new TaskResult("ThreadFactory", t.getName(), "CREATED");
        }
        return new TaskResult("ThreadFactory", "No Factory detected", "FAILED");
    }
}
