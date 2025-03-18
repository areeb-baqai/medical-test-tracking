import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className={`p-4 border-b border-gray-100 ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`p-4 border-t border-gray-100 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 