import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className=" bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                      <img src="/images/logo.png" height="50px" width="50px" />
                      Velora
                    </h1>
                    <p className="text-muted-foreground text-balance">
                      Login to Velora
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="custom" type="button" className="w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Google</span>
                    </Button>
                    <Button variant="custom" type="button" className="w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.302 
       3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 
       0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61 
       -.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 
       1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997 
       .108-.775.419-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.931 
       0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 
       0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 6.004 0c2.292-1.552 
       3.299-1.23 3.299-1.23.653 1.652.241 2.873.118 3.176.77.84 
       1.235 1.911 1.235 3.221 0 4.609-2.804 5.625-5.475 5.921 
       .43.371.823 1.103.823 2.222 0 1.604-.014 2.896-.014 3.286 
       0 .318.218.694.825.576C20.565 22.092 24 17.593 24 12.297 
       24 5.67 18.627.297 12 .297z"
                        />
                      </svg>

                      <span className="sr-only">Login with Github</span>
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a
                      href="/register"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </a>
                  </div>
                </div>
              </form>
              <div className=" relative hidden md:block p-2">
                <img
                  src="/images/login-bg.jpg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="w-full  absolute z-10 bottom-10 text-center  text-lg font-bold  drop-shadow-lg">
                  <span>Boost you work flow with Velora</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
