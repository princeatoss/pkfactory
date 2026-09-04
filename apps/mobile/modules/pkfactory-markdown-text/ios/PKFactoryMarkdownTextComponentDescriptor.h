#pragma once

#include "PKFactoryMarkdownTextShadowNode.h"

#include <react/renderer/core/ConcreteComponentDescriptor.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>

namespace facebook::react {
using PKFactoryMarkdownTextComponentDescriptor = ConcreteComponentDescriptor<PKFactoryMarkdownTextShadowNode>;

void PKFactoryMarkdownTextSpec_registerComponentDescriptorsFromCodegen(
  std::shared_ptr<const ComponentDescriptorProviderRegistry> registry);
}
