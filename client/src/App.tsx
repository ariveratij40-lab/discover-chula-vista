import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import MapPage from "./pages/MapPage";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import BusinessDashboard from "./pages/BusinessDashboard";
import Experiences from "./pages/Experiences";
import Amenities from "./pages/Amenities";
import PricingPage from "./pages/PricingPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Welcome} />
      <Route path={"/home"} component={Home} />
      <Route path={"/restaurants"} component={Restaurants} />
      <Route path={"/restaurants/:id"} component={RestaurantDetail} />
      <Route path={"/map"} component={MapPage} />
      <Route path={"/events"} component={Events} />
       <Route path="/events/:id" component={EventDetail} />
      <Route path="/business/dashboard" component={BusinessDashboard} />
      <Route path="/experiences" component={Experiences} />
      <Route path={"/amenities"} component={Amenities} />
      <Route path="/pricing" component={PricingPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
