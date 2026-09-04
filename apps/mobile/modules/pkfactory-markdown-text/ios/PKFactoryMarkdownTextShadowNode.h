#pragma once

#include <react/renderer/components/PKFactoryMarkdownTextSpec/EventEmitters.h>
#include <react/renderer/components/PKFactoryMarkdownTextSpec/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/textlayoutmanager/TextLayoutManager.h>
#include <react/renderer/core/LayoutContext.h>
#include <react/renderer/core/ShadowNode.h>

#include <string>
#include <vector>

namespace facebook::react {

extern const char PKFactoryMarkdownTextComponentName[];

struct PKFactoryMarkdownTextParagraphStyleRange {
  size_t location;
  size_t length;
  Float firstLineHeadIndent;
  Float headIndent;
  Float paragraphSpacing;
};

struct PKFactoryMarkdownTextAttachmentRange {
  size_t location;
  size_t length;
  std::string imageUri;
};

inline Float PKFactoryMarkdownTextAttachmentSize(const PKFactoryMarkdownTextAttachmentRange &) {
  return 14;
}

inline Float PKFactoryMarkdownTextAttachmentBaselineOffset(
    const PKFactoryMarkdownTextAttachmentRange &) {
  return -2;
}

class PKFactoryMarkdownTextStateReal final {
 public:
  AttributedString attributedString;
  std::vector<PKFactoryMarkdownTextParagraphStyleRange> paragraphStyleRanges;
  std::vector<PKFactoryMarkdownTextAttachmentRange> attachmentRanges;
};

class PKFactoryMarkdownTextShadowNode final : public ConcreteViewShadowNode<
PKFactoryMarkdownTextComponentName,
PKFactoryMarkdownTextProps,
PKFactoryMarkdownTextEventEmitter,
PKFactoryMarkdownTextStateReal> {
public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  PKFactoryMarkdownTextShadowNode(
   const ShadowNode& sourceShadowNode,
   const ShadowNodeFragment& fragment
  );

  static ShadowNodeTraits BaseTraits() {
    auto traits = ConcreteViewShadowNode::BaseTraits();
    traits.set(ShadowNodeTraits::Trait::LeafYogaNode);
    traits.set(ShadowNodeTraits::Trait::MeasurableYogaNode);
    return traits;
  }

  void layout(LayoutContext layoutContext) override;

  Size measureContent(
      const LayoutContext& layoutContext,
      const LayoutConstraints& layoutConstraints) const override;

private:
  mutable AttributedString _attributedString;
  mutable std::vector<PKFactoryMarkdownTextParagraphStyleRange> _paragraphStyleRanges;
  mutable std::vector<PKFactoryMarkdownTextAttachmentRange> _attachmentRanges;
};
} // namespace facebook::React
