package taskManager.tasks;

public class Mining extends Task{

    @Override
    public Mining deepCopy() {
        Mining copy = new Mining();
        copy.setDifficulty(this.getDifficulty());
        copy.setStatus(this.getStatus());
        Position p = new Position();
        p.setX(this.getPosition().getX());
        p.setY(this.getPosition().getY());
        p.setZ(this.getPosition().getZ());
        copy.setPosition(p);
        Scale s = new Scale();
        s.setWidth(this.getScale().getWidth());
        s.setHeight(this.getScale().getHeight());
        s.setDepth(this.getScale().getDepth());
        copy.setScale(s);
        copy.setRadius(this.getRadius());
        return copy;
    }
}
