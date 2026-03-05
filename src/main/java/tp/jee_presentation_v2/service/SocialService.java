package tp.jee_presentation_v2.service;

import jakarta.annotation.Resource;
import jakarta.enterprise.concurrent.ManagedScheduledExecutorService;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ScheduledFuture;

@ApplicationScoped
public class SocialService {

    @Resource
    private ManagedScheduledExecutorService scheduler;

    private final List<String> pendingEvents = new CopyOnWriteArrayList<>();
    private final List<String> latestDigest = new CopyOnWriteArrayList<>();
    private ScheduledFuture<?> batchTask;

    public void postEvent(String event) {
        pendingEvents.add(event);
        if (pendingEvents.size() >= 3 && batchTask == null) {
            scheduleBatching();
        }
    }

    private synchronized void scheduleBatching() {
        if (batchTask == null && scheduler != null) {
            batchTask = scheduler.schedule(() -> {
                latestDigest.clear();
                latestDigest.addAll(pendingEvents);
                pendingEvents.clear();
                batchTask = null; // reset for next batch
            }, 5, TimeUnit.SECONDS); // 5 seconds instead of 1 hour to see result in demo
        }
    }

    public List<String> getPendingEvents() {
        return new ArrayList<>(pendingEvents);
    }

    public List<String> getLatestDigest() {
        return new ArrayList<>(latestDigest);
    }
}
