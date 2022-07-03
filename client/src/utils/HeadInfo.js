import { Helmet } from 'react-helmet';

const HeadInfo = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | Kyiv</title>
    </Helmet>
  );
};

export default HeadInfo;
