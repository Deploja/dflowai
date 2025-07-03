
export const getInitials = (firstName: string, surname: string): string => {
  return (firstName.charAt(0) + surname.charAt(0)).toUpperCase();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const renderStars = (rating: number = 4) => {
  return Array.from({ length: 5 }, (_, i) => i < rating);
};

// Map status to display format
export const getStatusDisplay = (status: string) => {
  const statusMap: { [key: string]: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } } = {
    'prospect': { label: 'Prospect', variant: 'outline' },
    'focus': { label: 'Focus', variant: 'default' },
    'presented-prospect': { label: 'Presented Prospect', variant: 'secondary' },
    'phone-coordination': { label: 'Phone Coordination', variant: 'default' },
    'follow-up': { label: 'Follow Up', variant: 'secondary' },
    'high-interest': { label: 'High Interest', variant: 'default' },
    'upgrading-other-agreements': { label: 'Upgrading Other Agreements', variant: 'outline' },
    'seeking-upgrade': { label: 'Seeking Upgrade', variant: 'outline' },
    'postponed': { label: 'Postponed', variant: 'secondary' },
    'not-track': { label: 'Not Track', variant: 'destructive' },
    'ok-if': { label: 'OK If', variant: 'outline' }
  };
  return statusMap[status] || { label: 'Open', variant: 'default' as const };
};
