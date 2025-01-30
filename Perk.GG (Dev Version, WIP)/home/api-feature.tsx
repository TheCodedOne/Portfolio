import { CloudUpload, Lock, ServerCog } from "lucide-react";
import CodeBlock from "~/components/code-block";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

const features = [
  {
    name: "Grid Data.",
    description:
      "Access grid data, including sub-grid and block data, all up to 1000x faster than vanilla methods.",
    icon: CloudUpload,
  },
  {
    name: "Room API.",
    description:
      "Access even more oxygen-room data, including what specific blocks are contained in a room.",
    icon: Lock,
    tag: "Beta",
  },
  {
    name: "Mod API.",
    description:
      "Use our Mod API adapter to integrate your mod with Quartz-supported servers.",
    icon: ServerCog,
    tag: "Coming Soon",
  },
];

export default function APIFeatureSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
          <div className="px-6 md:px-0 lg:pr-4 lg:pt-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-primary">
                Quartz API
              </h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                A better toolset
              </p>
              <p className="mt-6 text-balance text-lg/8 text-muted-foreground">
                For the first time, you can build your own systems on top of our
                API, Quartz.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-muted-foreground lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-foreground">
                      <feature.icon
                        className="absolute left-1 top-1 size-5 text-primary"
                        aria-hidden="true"
                      />
                      {feature.name}
                      {feature.tag && (
                        <span className="ml-2 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                          {feature.tag}
                        </span>
                      )}
                    </dt>{" "}
                    <dd className="text-balance text-sm">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="sm:px-6 lg:px-0">
            <div className="relative isolate overflow-hidden bg-primary px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
              <div
                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-primary/20 opacity-20 ring-1 ring-inset ring-white"
                aria-hidden="true"
              />
              <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                <div className="overflow-hidden rounded-tl-xl bg-secondary ring-1 ring-white/10">
                  <div className="flex bg-secondary/40 ring-1 ring-white/5">
                    <div className="-mb-px flex text-sm/6 font-medium text-muted-foreground">
                      <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-foreground">
                        Example.cs
                      </div>
                      <div className="border-r border-border px-4 py-2">
                        Spawner.cs
                      </div>
                      <div className="border-r border-border px-4 py-2">
                        BridgeRoomManager.cs
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="px-6 pb-14 pt-6">
                    <CodeBlock lang="csharp">
                      {`using System.Collections.Generic;
using System.Linq;
using Quartz.API;
using Sandbox.Game.Entities;
using VRageMath;

public class Example
{
    public IEnumerable<MyThrust> GetAllThrustersInArea(BoundingSphereD bounds)
    {
        var groups = SpatialAPI.GetGridsInSphere(bounds);
        var thrusters = groups.SelectMany(e => e.Get(BlockReferences.Thruster));
        return thrusters;
    }

    public IEnumerable<IGridData> GetAllShipsNearPlayers(float distanceFromPlayer)
    {
        var players = SpatialAPI.GetAllControllableEntities();
        var playersAsSpheres = players.Select(e =>
            new BoundingSphereD(e.BoundingBox.Center, distanceFromPlayer));
        var groups = playersAsSpheres.SelectMany(SpatialAPI.GetGridsInSphere);
        var gridData = groups.SelectMany(e => e.GridData);
        return gridData;
    }
}`.replaceAll("    ", "  ")}
                    </CodeBlock>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
              <div
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border sm:rounded-3xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
