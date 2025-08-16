import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import CurrentPlanCard from './components/CurrentPlanCard';
import PlanComparisonCard from './components/PlanComparisonCard';
import BillingHistoryTable from './components/BillingHistoryTable';
import PaymentMethodCard from './components/PaymentMethodCard';
import UpgradeModal from './components/UpgradeModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [usageMetrics, setUsageMetrics] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const user = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com"
  };

  // Mock plans data
  const availablePlans = [
    {
      id: 'free',
      name: 'Free',
      tier: 'free',
      price: '$0',
      billingCycle: 'Free',
      icon: 'Zap',
      description: 'Perfect for trying out CogniSite AI',
      features: [
        { text: '1 saved project', included: true },
        { text: '3 pages analysis', included: true },
        { text: 'Basic AI insights', included: true },
        { text: 'Email support', included: true },
        { text: 'Unlimited projects', included: false },
        { text: 'Advanced AI insights', included: false },
        { text: 'Priority support', included: false },
        { text: 'Custom integrations', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      tier: 'premium',
      price: '$29',
      originalPrice: '$39',
      billingCycle: 'month',
      icon: 'Crown',
      description: 'Unlimited access to all features',
      trialDays: 14,
      features: [
        { text: 'Unlimited saved projects', included: true },
        { text: 'Unlimited pages analysis', included: true },
        { text: 'Advanced AI insights', included: true },
        { text: 'Priority support', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Export to multiple formats', included: true },
        { text: 'Team collaboration', included: true },
        { text: 'API access', included: true }
      ]
    }
  ];

  // Initialize mock data
  useEffect(() => {
    const initializeData = () => {
      // Mock current plan
      setCurrentPlan({
        id: 'free',
        name: 'Free Plan',
        tier: 'free',
        price: '$0/month',
        billingCycle: 'Free',
        status: 'active',
        renewalDate: null
      });

      // Mock usage metrics
      setUsageMetrics([
        {
          name: 'Saved Projects',
          used: 1,
          limit: 1
        },
        {
          name: 'Pages Analyzed',
          used: 8,
          limit: 10
        },
        {
          name: 'AI Generations',
          used: 45,
          limit: 50
        }
      ]);

      // Mock billing history (empty for free users)
      setBillingHistory([]);

      // Mock payment methods (empty initially)
      setPaymentMethods([]);

      setIsLoading(false);
    };

    initializeData();
  }, []);

  const handleUpgrade = (plan) => {
    setSelectedPlanForUpgrade(plan);
    setIsUpgradeModalOpen(true);
  };

  const handleConfirmUpgrade = (plan) => {
    // Update current plan
    setCurrentPlan({
      id: plan?.id,
      name: plan?.name,
      tier: plan?.tier,
      price: `${plan?.price}/${plan?.billingCycle}`,
      billingCycle: `Monthly`,
      status: 'active',
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });

    // Update usage metrics for premium
    if (plan?.tier === 'premium') {
      setUsageMetrics([
        {
          name: 'Saved Projects',
          used: 1,
          limit: -1 // Unlimited
        },
        {
          name: 'Pages Analyzed',
          used: 8,
          limit: -1 // Unlimited
        },
        {
          name: 'AI Generations',
          used: 45,
          limit: -1 // Unlimited
        }
      ]);

      // Add billing history entry
      setBillingHistory([
        {
          id: '1',
          date: new Date()?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          description: 'Premium Plan Subscription',
          period: `${new Date()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          amount: plan?.price,
          status: 'paid',
          invoiceId: 'INV-001'
        }
      ]);
    }
  };

  const handleAddPaymentMethod = (method) => {
    setPaymentMethods(prev => [...prev, method]);
  };

  const handleDeletePaymentMethod = (methodId) => {
    setPaymentMethods(prev => prev?.filter(method => method?.id !== methodId));
  };

  const handleSetDefaultPaymentMethod = (methodId) => {
    setPaymentMethods(prev => 
      prev?.map(method => ({
        ...method,
        isDefault: method?.id === methodId
      }))
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader user={user} />
        <div className="main-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading subscription details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader user={user} />
      <div className="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <button 
                onClick={() => navigate('/user-dashboard')}
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Subscription Management</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your subscription, billing, and payment methods
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Current Plan */}
            <CurrentPlanCard
              currentPlan={currentPlan}
              usageMetrics={usageMetrics}
              onUpgrade={() => handleUpgrade(availablePlans?.find(p => p?.tier === 'premium'))}
            />

            {/* Payment Methods */}
            <PaymentMethodCard
              paymentMethods={paymentMethods}
              onAddMethod={handleAddPaymentMethod}
              onDeleteMethod={handleDeletePaymentMethod}
              onSetDefault={handleSetDefaultPaymentMethod}
            />
          </div>

          {/* Plan Comparison */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Your Plan</h2>
              <p className="text-muted-foreground">
                Upgrade to unlock unlimited features and advanced AI capabilities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {availablePlans?.map((plan) => (
                <PlanComparisonCard
                  key={plan?.id}
                  plan={plan}
                  isCurrentPlan={currentPlan?.tier === plan?.tier}
                  isPopular={plan?.tier === 'premium'}
                  onSelectPlan={handleUpgrade}
                />
              ))}
            </div>
          </div>

          {/* Billing History */}
          <BillingHistoryTable billingHistory={billingHistory} />

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/user-dashboard')}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        selectedPlan={selectedPlanForUpgrade}
        onConfirmUpgrade={handleConfirmUpgrade}
        paymentMethods={paymentMethods}
      />
    </div>
  );
};

export default SubscriptionManagement;