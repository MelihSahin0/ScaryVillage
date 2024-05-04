package taskManager.tasks;

public class Chopping extends Task {

    @Override
    public Chopping deepCopy() {
        Chopping copy = new Chopping();
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
