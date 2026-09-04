#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCTBridge.h"
#import "Utils.h"

@interface PKFactoryMarkdownTextManager : RCTViewManager
@end

@implementation PKFactoryMarkdownTextManager

RCT_EXPORT_MODULE(PKFactoryMarkdownText)

- (UIView *)view
{
  return [[UIView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(color, NSString, UIView)
{
}

@end

@interface PKFactoryMarkdownTextRunManager : RCTViewManager
@end

@implementation PKFactoryMarkdownTextRunManager

RCT_EXPORT_MODULE(PKFactoryMarkdownTextRun)

- (UIView *)view
{
  return nil;
}

@end
