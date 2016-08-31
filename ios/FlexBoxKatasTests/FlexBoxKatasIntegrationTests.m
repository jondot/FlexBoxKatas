/**
* The examples provided by Facebook are for non-commercial testing and
* evaluation purposes only.
*
* Facebook reserves all rights not expressly granted.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
* OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
* FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
* AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import <RCTTest/RCTTestRunner.h>

#import "RCTAssert.h"
#import "RCTRedBox.h"
#import "RCTRootView.h"


@interface TestSampleIntegrationTests : XCTestCase
{
  RCTTestRunner *_runner;
}

@end

@implementation TestSampleIntegrationTests

- (void)setUp
{
_runner = RCTInitRunnerForApp(@"IntegrationTests/IntegrationTestsApp", nil);
_runner.recordMode = NO;
}

#define RCT_TEST(name)                  \
- (void)test##name                      \
{                                       \
[_runner runTest:_cmd module:@#name]; \
}

RCT_TEST(IntegrationTestHarnessTest)
RCT_TEST(DefaultLayoutTest)
RCT_TEST(SecondLayoutTest)

@end
