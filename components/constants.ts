import { Dimensions } from "react-native";

export const { width } = Dimensions.get("window");
export const ITEM_WIDTH = width * 0.56;
export const ITEM_HEIGHT = ITEM_WIDTH * 1.65;
export const SPACING = 26;
export const FULL_ITEM_WIDTH = ITEM_WIDTH + SPACING;