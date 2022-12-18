import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description: string;
  imgSrc: string;
  path: string;
};

const SEOHelmet = ({ title, description, imgSrc, path }: Props) => {
  const url = location.origin + (path === "/" ? "" : path);
  const imgUrl = location.origin + imgSrc;
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:url" content={url} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imgUrl} />

      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEOHelmet;
