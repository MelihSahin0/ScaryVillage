package extern.enumarators;

public enum Visibility {

    PRIVATE("private"),
    PUBLIC("public");

    private static final Visibility[] visibilities = Visibility.values();
    private final String visibility;

    Visibility(String visibility) {
        this.visibility = visibility;
    }

    public static Visibility getVisibility(int i){
        return visibilities[i];
    }

    @Override
    public String toString() {
        return visibility;
    }
}
