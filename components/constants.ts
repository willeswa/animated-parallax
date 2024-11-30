import { Dimensions } from "react-native";

export const { width } = Dimensions.get("window");
export const ITEM_WIDTH = width * 0.6;
export const ITEM_HEIGHT = ITEM_WIDTH * 1.5;
export const SPACING = 26;
export const FULL_ITEM_WIDTH = ITEM_WIDTH + SPACING;