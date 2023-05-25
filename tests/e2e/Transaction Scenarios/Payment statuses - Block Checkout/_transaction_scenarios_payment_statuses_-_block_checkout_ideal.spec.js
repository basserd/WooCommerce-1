const { expect } = require('@playwright/test');
const { test } = require('../../Shared/base-test');
const {normalizedName} = require("../../Shared/gateways");
const {noticeLines, checkExpiredAtMollie, classicCheckoutTransaction} = require("../../Shared/mollieUtils");
const {wooOrderPaidPage, wooOrderRetryPage, wooOrderDetailsPage} = require("../../Shared/testMollieInWooPage");
const {sharedUrl} = require("../../Shared/sharedUrl");
const {emptyCart} = require("../../Shared/wooUtils");

test.describe('_Transaction scenarios_Payment statuses - Block Checkout - iDEAL', () => {
    const productQuantity = 1;
    test.beforeEach(async ({ page , context, gateways}) => {
        context.method = gateways.ideal;
        context.methodName = normalizedName(context.method.defaultTitle);
        await emptyCart(page);
        await page.goto('/shop/');
    });
    const testData = [
        {
            testId: "C420244",
            mollieStatus: "Paid",
            wooStatus: "Processing",
            notice: context => noticeLines.paid(context.methodName),
            action: async (page, result, context) => {
                await wooOrderPaidPage(page, result.mollieOrder, result.totalAmount, context.method);
            }
        },
        {
            testId: "C420245",
            mollieStatus: "Open",
            wooStatus: "Pending payment",
            notice: context => noticeLines.open(context.methodName),
            action: async (page, result, context) => {
                await wooOrderPaidPage(page, result.mollieOrder, result.totalAmount, context.method);
            }
        },
        {
            testId: "C420246",
            mollieStatus: "Failed",
            wooStatus: "Pending payment",
            notice: context => noticeLines.failed(context.method.id),
            action: async (page) => {
                await wooOrderRetryPage(page);
            }
        },
        {
            testId: "C420248",
            mollieStatus: "Canceled",
            wooStatus: "Pending payment",
            notice: context => noticeLines.failed(context.method.id),
            action: async (page) => {
                await wooOrderRetryPage(page);
            }
        },
        {
            testId: "C420247",
            mollieStatus: "Expired",
            wooStatus: "Pending payment",
            notice: context => noticeLines.expired(context.method.id),
            action: async (page) => {
                await checkExpiredAtMollie(page);
            }
        },
    ];

    testData.forEach(({ testId, mollieStatus, wooStatus, notice, action }) => {
        test(`[${testId}] Validate the submission of an order with iDEAL as payment method and payment mark as "${mollieStatus} on block checkout"`, async ({ page, products, context }) => {
            const result = await classicCheckoutTransaction(page, products.simple, context.method, productQuantity, mollieStatus, sharedUrl.blocksCheckout);
            await action(page, result, context);
            await wooOrderDetailsPage(page, result.mollieOrder, context.method, wooStatus, notice(context));
        });
    });
});