import { requireOptionalNativeModule } from "expo";

interface PKFactoryMarkdownTextSelectionNativeModule {
  readonly installCopySanitizer: (reactTag: number) => void;
}

const nativeModule = requireOptionalNativeModule<PKFactoryMarkdownTextSelectionNativeModule>(
  "PKFactoryMarkdownTextSelection",
);

export function installMarkdownCopySanitizer(reactTag: number): void {
  nativeModule?.installCopySanitizer(reactTag);
}
