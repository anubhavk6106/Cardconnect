import '../styles/VerifiedBadge.css';

const VerifiedBadge = ({ isVerified, level = 'verified', size = 'medium' }) => {
  if (!isVerified) return null;

  const getBadgeInfo = () => {
    switch (level) {
      case 'premium':
        return {
          icon: '⭐',
          text: 'Premium Verified',
          class: 'verified-premium'
        };
      case 'verified':
        return {
          icon: '✓',
          text: 'Verified',
          class: 'verified-standard'
        };
      case 'basic':
        return {
          icon: '✓',
          text: 'Basic Verified',
          class: 'verified-basic'
        };
      default:
        return {
          icon: '✓',
          text: 'Verified',
          class: 'verified-standard'
        };
    }
  };

  const badge = getBadgeInfo();

  return (
    <span className={`verified-badge ${badge.class} ${size}`} title={badge.text}>
      {badge.icon}
    </span>
  );
};

export default VerifiedBadge;
