package votingManager;

import extern.enumarators.Colors;
import extern.enumarators.Roles;

public class Player {
    private final String id;
    private String name;
    private Colors color;
    private Roles role;
    private boolean requester = false;
    private int numberOfVotes = 0;
    private boolean killed = false;
    private String votedFor = "";

    public Player(String id, String name, Colors color, Roles role) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public Colors getColor() {
        return color;
    }

    public void setColor(Colors color){
        this.color = color;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }

    public boolean isRequester() {
        return requester;
    }

    public void setRequester(boolean requester) {
        this.requester = requester;
    }

    public boolean isKilled() {
        return killed;
    }

    public void setKilled(boolean killed) {
        this.killed = killed;
    }

    public int getNumberOfVotes() {
        return numberOfVotes;
    }

    public void setNumberOfVotes(int numberOfVotes) {
        this.numberOfVotes = numberOfVotes;
    }

    public void incrementNumberOfVotes() {
        numberOfVotes++;
    }

    public String getVotedFor() {
        return votedFor;
    }

    public void setVotedFor(String votedFor) {
        this.votedFor = votedFor;
    }

    public void killed() {
        switch (role) {
            case CREWMATE:
                role = Roles.CREWMATEGHOST;
                break;
            case IMPOSTER:
                role = Roles.IMPOSTERGHOST;
                break;
        }
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\": \"" + id + "\"" +
                ", \"name\": \"" + name + "\"" +
                ", \"color\": \"" + color.toString() + "\"" +
                ", \"role\": " + "\"" + role + "\"" +
                ", \"requester\": " + "\"" + requester + "\"" +
                ", \"numberOfVotes\": " + "\"" + numberOfVotes + "\"" +
                ", \"killed\": " + "\"" + killed + "\"" +
                '}';
    }
}
