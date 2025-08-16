import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentMethodCard = ({ paymentMethods, onAddMethod, onDeleteMethod, onSetDefault }) => {
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [isLoading, setIsLoading] = useState({});
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleAddMethod = async (e) => {
    e?.preventDefault();
    setIsLoading(prev => ({ ...prev, add: true }));
    
    // Simulate API call
    setTimeout(() => {
      const newMethod = {
        id: Date.now()?.toString(),
        type: 'card',
        brand: 'visa',
        last4: cardForm?.cardNumber?.slice(-4),
        expiryMonth: cardForm?.expiryDate?.split('/')?.[0],
        expiryYear: cardForm?.expiryDate?.split('/')?.[1],
        cardholderName: cardForm?.cardholderName,
        isDefault: paymentMethods?.length === 0
      };
      
      onAddMethod(newMethod);
      setCardForm({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
      setIsAddingMethod(false);
      setIsLoading(prev => ({ ...prev, add: false }));
    }, 2000);
  };

  const handleDeleteMethod = async (methodId) => {
    setIsLoading(prev => ({ ...prev, [methodId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      onDeleteMethod(methodId);
      setIsLoading(prev => ({ ...prev, [methodId]: false }));
    }, 1000);
  };

  const handleSetDefault = async (methodId) => {
    setIsLoading(prev => ({ ...prev, [`default_${methodId}`]: true }));
    
    // Simulate API call
    setTimeout(() => {
      onSetDefault(methodId);
      setIsLoading(prev => ({ ...prev, [`default_${methodId}`]: false }));
    }, 1000);
  };

  const getCardIcon = (brand) => {
    switch (brand) {
      case 'visa':
        return 'CreditCard';
      case 'mastercard':
        return 'CreditCard';
      case 'amex':
        return 'CreditCard';
      default:
        return 'CreditCard';
    }
  };

  const formatCardNumber = (value) => {
    const v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
    const matches = v?.match(/\d{4,16}/g);
    const match = matches && matches?.[0] || '';
    const parts = [];
    for (let i = 0, len = match?.length; i < len; i += 4) {
      parts?.push(match?.substring(i, i + 4));
    }
    if (parts?.length) {
      return parts?.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
    if (v?.length >= 2) {
      return v?.substring(0, 2) + '/' + v?.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Payment Methods</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your saved payment methods
          </p>
        </div>
        {!isAddingMethod && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingMethod(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Method
          </Button>
        )}
      </div>
      {/* Existing Payment Methods */}
      {paymentMethods?.length > 0 && (
        <div className="space-y-4 mb-6">
          {paymentMethods?.map((method) => (
            <div key={method?.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name={getCardIcon(method?.brand)} size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground capitalize">
                      {method?.brand} •••• {method?.last4}
                    </span>
                    {method?.isDefault && (
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expires {method?.expiryMonth}/{method?.expiryYear} • {method?.cardholderName}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!method?.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(method?.id)}
                    loading={isLoading?.[`default_${method?.id}`]}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteMethod(method?.id)}
                  loading={isLoading?.[method?.id]}
                  iconName="Trash2"
                  iconSize={16}
                  className="text-error hover:text-error"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Add New Payment Method Form */}
      {isAddingMethod && (
        <form onSubmit={handleAddMethod} className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Add New Card</h3>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsAddingMethod(false)}
              iconName="X"
              iconSize={16}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Cardholder Name"
                type="text"
                placeholder="John Doe"
                value={cardForm?.cardholderName}
                onChange={(e) => setCardForm(prev => ({ ...prev, cardholderName: e?.target?.value }))}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Card Number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardForm?.cardNumber}
                onChange={(e) => setCardForm(prev => ({ ...prev, cardNumber: formatCardNumber(e?.target?.value) }))}
                maxLength={19}
                required
              />
            </div>
            
            <Input
              label="Expiry Date"
              type="text"
              placeholder="MM/YY"
              value={cardForm?.expiryDate}
              onChange={(e) => setCardForm(prev => ({ ...prev, expiryDate: formatExpiryDate(e?.target?.value) }))}
              maxLength={5}
              required
            />
            
            <Input
              label="CVV"
              type="text"
              placeholder="123"
              value={cardForm?.cvv}
              onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e?.target?.value?.replace(/\D/g, '') }))}
              maxLength={4}
              required
            />
          </div>
          
          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="submit"
              variant="default"
              loading={isLoading?.add}
              iconName="Plus"
              iconPosition="left"
            >
              Add Payment Method
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingMethod(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      {/* Empty State */}
      {paymentMethods?.length === 0 && !isAddingMethod && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CreditCard" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No payment methods</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add a payment method to upgrade your plan and manage billing.
          </p>
          <Button
            variant="outline"
            onClick={() => setIsAddingMethod(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Payment Method
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;