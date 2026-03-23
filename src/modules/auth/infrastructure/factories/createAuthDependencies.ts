import { GetCurrentAdminSessionUseCase } from "../../application/use-cases/GetCurrentAdminSessionUseCase";
import { StartAdminSessionUseCase } from "../../application/use-cases/StartAdminSessionUseCase";
import { EndAdminSessionUseCase } from "../../application/use-cases/EndAdminSessionUseCase";
import { CookieSessionFactory } from "../adapters/cookie/CookieSessionFactory";
import { CookieSessionStorage } from "../adapters/cookie/CookieSessionStorage";
import { EnvironmentAdminPolicy } from "../adapters/firebase/EnvironmentAdminPolicy";
import { FirebaseIdentityToolkitAuthVerifier } from "../adapters/firebase/FirebaseIdentityToolkitAuthVerifier";

export function createAuthDependencies() {
  const sessionStorage = new CookieSessionStorage();
  const sessionFactory = new CookieSessionFactory();
  const tokenVerifier = new FirebaseIdentityToolkitAuthVerifier();
  const adminPolicy = new EnvironmentAdminPolicy();

  return {
    getCurrentAdminSessionUseCase: new GetCurrentAdminSessionUseCase(sessionStorage),
    startAdminSessionUseCase: new StartAdminSessionUseCase(
      tokenVerifier,
      adminPolicy,
      sessionFactory,
      sessionStorage,
    ),
    endAdminSessionUseCase: new EndAdminSessionUseCase(sessionStorage),
  };
}
