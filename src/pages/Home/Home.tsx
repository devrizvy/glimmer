import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Study. Chat. Think Better.
          </h1>
          <p className="text-muted-foreground text-lg">
            A focused chat app built for learning — with group discussions,
            favorite chats, AI summaries, and note taking in one place.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <NavLink to={"/chat"}>
          <Button size="lg">Open App</Button>
          </NavLink>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          <Card>
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-semibold">Smart Chats</h3>
              <p className="text-sm text-muted-foreground">
                Direct, favorite, and group chats designed for study sessions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-semibold">AI Summaries</h3>
              <p className="text-sm text-muted-foreground">
                Turn long discussions into short, clear study notes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-semibold">Built-in Notes</h3>
              <p className="text-sm text-muted-foreground">
                Keep personal notes right beside your conversations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
