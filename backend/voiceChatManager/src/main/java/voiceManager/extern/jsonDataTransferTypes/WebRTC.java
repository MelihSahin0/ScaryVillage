package voiceManager.extern.jsonDataTransferTypes;

public class WebRTC {
    private String type;
    private String sdp = "";
    private String candidate = "";

    public String getSdp() {
        return sdp;
    }

    public void setSdp(String sdp) {
        this.sdp = sdp;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCandidate() {
        return candidate;
    }

    public void setCandidate(String candidate) {
        this.candidate = candidate;
    }

    @Override
    public String toString() {
        return "{" +
                "\"sdp\":" + sdp +
                ", \"type\": \"" + type + "\"" +
                ", \"candidate\":" + candidate +
                '}';
    }
}
