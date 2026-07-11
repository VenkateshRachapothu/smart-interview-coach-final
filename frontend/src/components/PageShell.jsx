import Layout from "./Layout";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageContainer from "./PageContainer";
import PageHeader from "./PageHeader";
import StepProgress from "./StepProgress";

function PageShell({
  step,
  title,
  subtitle,
  children,
  actions,
  stickyActions = false,
}) {
  return (
    <Layout>
      <Navbar />
      {step && <StepProgress currentStep={step} />}
      <PageContainer>
        {title && <PageHeader title={title} subtitle={subtitle} />}
        {children}
        {actions}
      </PageContainer>
      <Footer />
    </Layout>
  );
}

export default PageShell;
