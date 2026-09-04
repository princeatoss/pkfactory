import type { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";
import { withUniwind } from "uniwind";

const ThemedPath = withUniwind(Path);

/**
 * The PK Factory brand mark, matching the desktop sidebar's PKFactoryWordmark SVG
 * (apps/web Sidebar.tsx). Width derives from the viewBox aspect ratio.
 */
export function PKFactoryWordmark(props: {
  readonly height: number;
  readonly color?: ColorValue;
  readonly colorClassName?: string;
}) {
  const aspectRatio = 70 / 40;
  return (
    <Svg
      accessibilityLabel="PK Factory"
      height={props.height}
      width={props.height * aspectRatio}
      viewBox="0 0 70 40"
    >
      <ThemedPath
        d="M3 3h17c9 0 14 5 14 13s-5 13-14 13h-9v8H3V3Zm8 8v10h9c4 0 6-2 6-5s-2-5-6-5h-9Zm27-8h8v13L57 3h10L53 19l15 18H57L46 24v13h-8V3Z"
        color={props.color}
        colorClassName={props.colorClassName}
        fill="currentColor"
      />
    </Svg>
  );
}
