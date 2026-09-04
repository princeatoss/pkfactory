#pragma once

#include <react/renderer/components/PKFactoryMarkdownTextSpec/EventEmitters.h>
#include <react/renderer/components/PKFactoryMarkdownTextSpec/Props.h>
#include <react/renderer/components/PKFactoryMarkdownTextSpec/States.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook::react {
extern const char PKFactoryMarkdownTextRunComponentName[];

using PKFactoryMarkdownTextRunShadowNode = ConcreteViewShadowNode<
    PKFactoryMarkdownTextRunComponentName,
    PKFactoryMarkdownTextRunProps,
    PKFactoryMarkdownTextRunEventEmitter,
    PKFactoryMarkdownTextRunState>;
}
