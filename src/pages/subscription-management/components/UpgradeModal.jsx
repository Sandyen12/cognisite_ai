import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  onConfirmUpgrade,
  paymentMethods = []
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && paymentMethods?.length > 0) {
      const defaultMethod = paymentMethods?.find(method => method?.isDefault);
      setSelectedPaymentMethod(defaultMethod?.id || paymentMethods?.[0]?.id || '');
    }
  }, [isOpen, paymentMethods]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Show success for 2 seconds then close
      setTimeout(() => {
        setShowSuccess(false);
        onConfirmUpgrade(selectedPlan);
        onClose();
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    if (!isProcessing && !showSuccess) {
      onClose();
    }
  };

  if (!isOpen || !selectedPlan) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative bg-card border border-border rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Check" size={32} color="white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Upgrade Successful!
          </h2>
          <p className="text-muted-foreground">
            Welcome to {selectedPlan?.name}! Your new features are now active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-card border border-border rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Upgrade to {selectedPlan?.name}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isProcessing}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Plan Summary */}
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                <Icon name={selectedPlan?.icon} size={20} color="white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{selectedPlan?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedPlan?.description}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <div className="text-right">
                <div className="text-lg font-semibold text-foreground">{selectedPlan?.price}</div>
                <div className="text-xs text-muted-foreground">per {selectedPlan?.billingCycle}</div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          {paymentMethods?.length > 0 ? (
            <div>
              <h4 className="font-medium text-foreground mb-3">Payment Method</h4>
              <div className="space-y-2">
                {paymentMethods?.map((method) => (
                  <label
                    key={method?.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPaymentMethod === method?.id 
                        ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method?.id}
                      checked={selectedPaymentMethod === method?.id}
                      onChange={(e) => setSelectedPaymentMethod(e?.target?.value)}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name="CreditCard" size={16} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground capitalize">
                        {method?.brand} •••• {method?.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {method?.expiryMonth}/{method?.expiryYear}
                      </div>
                    </div>
                    {method?.isDefault && (
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                        Default
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Icon name="CreditCard" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                You'll be redirected to add a payment method
              </p>
            </div>
          )}

          {/* Features Highlight */}
          <div>
            <h4 className="font-medium text-foreground mb-3">What you'll get:</h4>
            <div className="space-y-2">
              {selectedPlan?.features?.filter(f => f?.included)?.slice(0, 4)?.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-foreground">{feature?.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p>
              By upgrading, you agree to our Terms of Service and Privacy Policy. 
              Your subscription will automatically renew unless canceled. 
              You can cancel anytime from your account settings.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          
          <Button
            variant="default"
            onClick={handleUpgrade}
            loading={isProcessing}
            disabled={paymentMethods?.length === 0 && !isProcessing}
            className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
          >
            {isProcessing ? 'Processing...' : `Upgrade to ${selectedPlan?.name}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;