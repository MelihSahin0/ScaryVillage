package extern.enumarators;

public enum Roles {
    CREWMATE("crewmate"),
    IMPOSTER("imposter"),
    CREWMATEGHOST("crewmateGhost"),
    IMPOSTERGHOST("imposterGhost");

    private static final Roles[] roles = Roles.values();
    private final String role;

    Roles(String role) {
        this.role = role;
    }

    public static Roles getRole(int i){
        return roles[i];
    }

    @Override
    public String toString() {
        return role;
    }
}