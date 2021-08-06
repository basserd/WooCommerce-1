<?php

declare(strict_types=1);

namespace Mollie\WooCommerce\Gateway\Belfius;

use Mollie\Api\Types\PaymentMethod;
use Mollie\WooCommerce\Gateway\PaymentService;
use Mollie\WooCommerce\Gateway\SurchargeService;
use Mollie\WooCommerce\Notice\NoticeInterface;
use Mollie\WooCommerce\Payment\MollieOrderService;
use Mollie\WooCommerce\SDK\HttpResponse;
use Mollie\WooCommerce\Subscription\AbstractSepaRecurring;
use Mollie\WooCommerce\Utils\IconFactory;
use Psr\Log\LoggerInterface as Logger;

class Mollie_WC_Gateway_Belfius extends AbstractSepaRecurring
{
    /**
     *
     */
    public function __construct(
        IconFactory $iconFactory,
        PaymentService $paymentService,
        SurchargeService $surchargeService,
        MollieOrderService $mollieOrderService,
        Logger $logger,
        NoticeInterface $notice,
        HttpResponse $httpResponse,
        string $pluginUrl,
        string $pluginPath
    ) {

        $this->supports = [
            'products',
            'refunds',
        ];
        parent::__construct(
            $iconFactory,
            $paymentService,
            $surchargeService,
            $mollieOrderService,
            $logger,
            $notice,
            $httpResponse,
            $pluginUrl,
            $pluginPath
        );
    }

    /**
     * @return string
     */
    public function getMollieMethodId()
    {
        return PaymentMethod::BELFIUS;
    }

    /**
     * @return string
     */
    public function getDefaultTitle()
    {
        return __('Belfius Direct Net', 'mollie-payments-for-woocommerce');
    }

    /**
     * @return string
     */
    protected function getSettingsDescription()
    {
        return '';
    }

    /**
     * @return string
     */
    protected function getDefaultDescription()
    {
        return '';
    }
}
