import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BillingHistoryTable = ({ billingHistory }) => {
  const [isLoading, setIsLoading] = useState({});

  const handleDownloadInvoice = async (invoiceId) => {
    setIsLoading(prev => ({ ...prev, [invoiceId]: true }));
    
    // Simulate download delay
    setTimeout(() => {
      // In a real app, this would trigger actual download
      const link = document.createElement('a');
      link.href = `#invoice-${invoiceId}`;
      link.download = `invoice-${invoiceId}.pdf`;
      link?.click();
      
      setIsLoading(prev => ({ ...prev, [invoiceId]: false }));
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'failed':
        return 'text-error bg-error/10';
      case 'refunded':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'failed':
        return 'XCircle';
      case 'refunded':
        return 'RotateCcw';
      default:
        return 'Circle';
    }
  };

  if (billingHistory?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Receipt" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No billing history</h3>
        <p className="text-sm text-muted-foreground">
          Your billing history will appear here once you make your first payment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Billing History</h2>
        <p className="text-sm text-muted-foreground mt-1">
          View and download your past invoices
        </p>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {billingHistory?.map((item) => (
              <tr key={item?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {item?.date}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  <div>
                    <div className="font-medium">{item?.description}</div>
                    {item?.period && (
                      <div className="text-muted-foreground text-xs mt-1">
                        {item?.period}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {item?.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item?.status)}`}>
                    <Icon name={getStatusIcon(item?.status)} size={12} />
                    <span className="capitalize">{item?.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item?.invoiceId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadInvoice(item?.invoiceId)}
                      loading={isLoading?.[item?.invoiceId]}
                      iconName="Download"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Download
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {billingHistory?.map((item) => (
          <div key={item?.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-foreground">{item?.description}</div>
                <div className="text-sm text-muted-foreground">{item?.date}</div>
                {item?.period && (
                  <div className="text-xs text-muted-foreground mt-1">{item?.period}</div>
                )}
              </div>
              <div className="text-right">
                <div className="font-medium text-foreground">{item?.amount}</div>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(item?.status)}`}>
                  <Icon name={getStatusIcon(item?.status)} size={12} />
                  <span className="capitalize">{item?.status}</span>
                </div>
              </div>
            </div>
            
            {item?.invoiceId && (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => handleDownloadInvoice(item?.invoiceId)}
                loading={isLoading?.[item?.invoiceId]}
                iconName="Download"
                iconPosition="left"
                iconSize={14}
              >
                Download Invoice
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingHistoryTable;