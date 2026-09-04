#pragma once

#include "PKFactoryMarkdownTextRunShadowNode.h"

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>

namespace facebook::react {
using PKFactoryMarkdownTextRunComponentDescriptor = ConcreteComponentDescriptor<PKFactoryMarkdownTextRunShadowNode>;

void PKFactoryMarkdownTextRunSpec_registerComponentDescriptorsFromCodegen(
  std::shared_ptr<const ComponentDescriptorProviderRegistry> registry);
}
