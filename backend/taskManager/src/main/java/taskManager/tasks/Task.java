package taskManager.tasks;

import intern.PlayerPosi;
import taskManager.TaskDifficulty;
import taskManager.TaskStatus;

import java.util.Objects;

public abstract class Task {

    private String taskId;
    private TaskDifficulty difficulty;
    private TaskStatus status;
    private Position position;
    private Scale scale;
    private double radius;

    public TaskDifficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(TaskDifficulty difficulty) {
        this.difficulty = difficulty;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public double getRadius() {
        return radius;
    }

    public void setRadius(double radius) {
        this.radius = radius;
    }

    public Scale getScale() {
        return scale;
    }

    public void setScale(Scale scale) {
        this.scale = scale;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public boolean insideRadius(PlayerPosi playerPosi){
        return Math.sqrt(Math.pow(position.getX() - playerPosi.getX(),2) + Math.pow(position.getY() - playerPosi.getY(),2)) <= radius;
    }

    public abstract Task deepCopy();

    @Override
    public String toString() {
        return "{" +
                "\"taskId\": \"" + taskId + "\"" +
                ", \"type\": \"" + this.getClass().getSimpleName() + "\"" +
                ", \"position\": " + position +
                ", \"scale\": " + scale +
                ", \"radius\": " + radius +
                '}';
    }

    public static class Position{
        private double x;
        private double y;
        private double z;

        public double getX() {
            return x;
        }

        public void setX(double x) {
            this.x = x;
        }

        public double getY() {
            return y;
        }

        public void setY(double y) {
            this.y = y;
        }

        public double getZ() {
            return z;
        }

        public void setZ(double z) {
            this.z = z;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (obj == null || getClass() != obj.getClass()) {
                return false;
            }
            Position other = (Position) obj;
            return x == other.x && y == other.y && z == other.z;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y, z);
        }

        @Override
        public String toString() {
            return "{" +
                    "\"x\": " + x +
                    ", \"y\":" + y +
                    ", \"z\":" + z +
                    '}';
        }
    }

    public static class Scale{
        private double width;
        private double height;
        private double depth;

        public double getDepth() {
            return depth;
        }

        public void setDepth(double depth) {
            this.depth = depth;
        }

        public double getHeight() {
            return height;
        }

        public void setHeight(double height) {
            this.height = height;
        }

        public double getWidth() {
            return width;
        }

        public void setWidth(double width) {
            this.width = width;
        }

        @Override
        public String toString() {
            return "{" +
                    "\"width\": " + width +
                    ", \"height\":" + height +
                    ", \"depth\":" + depth +
                    '}';
        }
    }
}
