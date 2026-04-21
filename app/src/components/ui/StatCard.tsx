import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type StatCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  linkText: string;
  color: 'blue' | 'green' | 'orange';
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    link: 'text-blue-600 hover:text-blue-700',
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    link: 'text-green-600 hover:text-green-700',
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    link: 'text-orange-600 hover:text-orange-700',
  },
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  description, 
  icon, 
  linkTo, 
  linkText,
  color 
}) => {
  const classes = colorClasses[color];
  
  return (
    <div className={`${classes.bg} rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02]`}>
      <div className={`${classes.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link 
        to={linkTo} 
        className={`inline-flex items-center ${classes.link} font-medium`}
      >
        {linkText} <ArrowRight className="ml-1 w-4 h-4" />
      </Link>
    </div>
  );
};

export default StatCard;