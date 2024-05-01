package taskManager;

import taskManager.tasks.*;
import java.util.*;

public class VillageMeshesDTO {

        private List<Bin> bin;
        private Cave cave;
        private List<Chicken> chicken;
        private List<Chopping> chopping;
        private List<Cooking> cooking;
        private List<Fishing> fishing;
        private List<Flooding> flooding;
        private List<Fountain> fountain;
        private List<Mining> mining;
        private List<Sleeping> sleeping;

        public List<Bin> getBin() {
                return bin;
        }

        public void setBin(List<Bin> bin) {
                this.bin = bin;
        }

        public Cave getCave() {
                return cave;
        }

        public void setCave(Cave cave) {
                this.cave = cave;
        }

        public List<Chicken> getChicken() {
                return chicken;
        }

        public void setChicken(List<Chicken> chicken) {
                this.chicken = chicken;
        }

        public List<Chopping> getChopping() {
                return chopping;
        }

        public void setChopping(List<Chopping> chopping) {
                this.chopping = chopping;
        }

        public List<Cooking> getCooking() {
                return cooking;
        }

        public void setCooking(List<Cooking> cooking) {
                this.cooking = cooking;
        }

        public List<Fishing> getFishing() {
                return fishing;
        }

        public void setFishing(List<Fishing> fishing) {
                this.fishing = fishing;
        }

        public List<Flooding> getFlooding() {
                return flooding;
        }

        public void setFlooding(List<Flooding> flooding) {
                this.flooding = flooding;
        }

        public List<Fountain> getFountain() {
                return fountain;
        }

        public void setFountain(List<Fountain> fountain) {
                this.fountain = fountain;
        }

        public List<Mining> getMining() {
                return mining;
        }

        public void setMining(List<Mining> mining) {
                this.mining = mining;
        }

        public List<Sleeping> getSleeping() {
                return sleeping;
        }

        public void setSleeping(List<Sleeping> sleeping) {
                this.sleeping = sleeping;
        }
}
