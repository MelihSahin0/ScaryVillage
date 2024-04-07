package playerManager.enumarators;
public enum Colors {
    RED("red"),
    BLUE("blue"),
    GREEN("green"),
    ORANGE("orange"),
    PURPLE("purple"),
    CYAN("cyan"),
    PINK("pink"),
    LIME("lime"),
    YELLOW("yellow"),
    ZINC("zinc");

    private static final Colors[] color = Colors.values();
    private final String colorName;

    Colors(String colorName) {
        this.colorName = colorName;
    }

    public static Colors getColor(int i){
        return color[i];
    }

    @Override
    public String toString() {
        return colorName;
    }
}
