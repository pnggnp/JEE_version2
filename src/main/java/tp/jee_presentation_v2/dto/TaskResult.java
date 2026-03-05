package tp.jee_presentation_v2.dto;

public class TaskResult {
    private String taskName;
    private String threadName;
    private String status;
    private Object data;

    public TaskResult() {
    }

    public TaskResult(String taskName, String threadName, String status) {
        this.taskName = taskName;
        this.threadName = threadName;
        this.status = status;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getThreadName() {
        return threadName;
    }

    public void setThreadName(String threadName) {
        this.threadName = threadName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
