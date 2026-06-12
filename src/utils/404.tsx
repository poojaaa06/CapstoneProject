import React, { useEffect, useState, type FC } from "react";
import { Button, Result, Row, Col, notification } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { notFoundContent, type NotFoundContent } from "../stubs/notFound.stub";
import "./404.css";

const USER_KEY = "userDetails";

interface AuthTarget {
  path: string;
  label: string;
  isLoggedIn: boolean;
}

const resolveAuthTarget = (): AuthTarget => {
  const userDetails =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem(USER_KEY)
      : null;
  const isLoggedIn: boolean = Boolean(userDetails);
  return {
    isLoggedIn,
    path: isLoggedIn ? "/dashboard" : "/",
    label: isLoggedIn ? "Dashboard" : "Login",
  };
};

const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const content: NotFoundContent = notFoundContent;
  const target: AuthTarget = resolveAuthTarget();

  const [secondsLeft, setSecondsLeft] = useState<number>(content.redirectSeconds);
  const [api, contextHolder] = notification.useNotification();

  useEffect((): (() => void) => {
    api.warning({
      key: "404-notification",
      message: "Page not found",
      description: `Redirecting you to ${target.label} in ${content.redirectSeconds} seconds.`,
      placement: "topRight",
      duration: 4,
    });

    const interval: ReturnType<typeof setInterval> = setInterval((): void => {
      setSecondsLeft((s: number): number => (s > 0 ? s - 1 : 0));
    }, 1000);

    const timeout: ReturnType<typeof setTimeout> = setTimeout((): void => {
      navigate(target.path, { replace: true });
    }, content.redirectSeconds * 1000);

    return (): void => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [api, navigate, target.label, target.path, content.redirectSeconds]);

  const handlePrimary = (): void => navigate(target.path, { replace: true });
  const handleBack = (): void => navigate(-1);

  const titleWords = content.title.trim().split(" ");
  const titleLead = titleWords.slice(0, -1).join(" ");
  const titleAccent = titleWords.slice(-1).join(" ");

  return (
    <main
      className="nf-wrapper"
      role="main"
      aria-labelledby="nf-title"
      aria-describedby="nf-subtitle"
    >
      {contextHolder}
      <Row justify="start" align="middle" style={{ width: "100%" }}>
        <Col xs={24} sm={20} md={16} lg={14} xl={12} xxl={10}>
          <section className="nf-card" aria-live="polite">
            <Result
              status="404"
              title={
                <p id="nf-title" className="nf-title">
                  {titleLead}{" "}
                  <span className="nf-title-accent">{titleAccent}.</span>
                </p>
              }
              subTitle={
                <p id="nf-subtitle" className="nf-subtitle">
                  {content.subtitle}
                </p>
              }
              extra={
                <div>
                  <div className="nf-actions" role="group" aria-label="Navigation options">
                    <Button
                      type="primary"
                      size="large"
                      icon={target.isLoggedIn ? <HomeOutlined /> : <LoginOutlined />}
                      onClick={handlePrimary}
                      aria-label={`Go to ${target.label}`}
                    >
                      Go to {target.label}
                    </Button>
                    <Button
                      size="large"
                      icon={<ArrowLeftOutlined />}
                      onClick={handleBack}
                      aria-label="Go back to previous page"
                    >
                      Go Back
                    </Button>
                  </div>
                  <p className="nf-hint" aria-live="polite" aria-atomic="true">
                    Auto-redirecting in <strong>{secondsLeft}s</strong>…
                  </p>
                </div>
              }
            />
          </section>
        </Col>
      </Row>
    </main>
  );
};

export default NotFoundPage;