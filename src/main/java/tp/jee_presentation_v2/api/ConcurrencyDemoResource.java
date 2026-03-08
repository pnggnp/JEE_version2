package tp.jee_presentation_v2.api;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import tp.jee_presentation_v2.dto.TaskResult;
import tp.jee_presentation_v2.service.*;

import java.util.List;
import java.util.Map;

@Path("/demo")
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ConcurrencyDemoResource {

    @Inject
    private HubService hubService;

    @Inject
    private PizzaService pizzaService;

    @Inject
    private TickerService tickerService;

    @Inject
    private SocialService socialService;

    @Inject
    private ContextDemoService contextDemoService;

    @POST
    @Path("/hub")
    public Response runHubTask(Map<String, String> payload) {
        String taskName = payload.getOrDefault("taskName", "Generic Task");
        TaskResult result = hubService.processTask(taskName);
        return Response.ok(result).build();
    }

    @POST
    @Path("/pizza")
    public Response orderPizza(Map<String, String> payload) {
        String customerName = payload.getOrDefault("customerName", "Guest");
        List<TaskResult> results = pizzaService.orderPizza(customerName);
        return Response.ok(results).build();
    }

    @GET
    @Path("/ticker")
    public Response getTickerPrices() {
        return Response.ok(tickerService.getLatestPrices()).build();
    }

    @POST
    @Path("/ticker")
    public Response addTicker(Map<String, String> payload) {
        String symbol = payload.getOrDefault("symbol", "UNKNOWN");
        tickerService.addTicker(symbol);
        return Response.ok().build();
    }

    @POST
    @Path("/social")
    public Response postSocialEvent(Map<String, String> payload) {
        String event = payload.getOrDefault("event", "New Interaction");
        socialService.postEvent(event);
        return Response.ok(socialService.getPendingEvents()).build();
    }

    @GET
    @Path("/social/digest")
    public Response getSocialDigest() {
        return Response.ok(socialService.getLatestDigest()).build();
    }

    @POST
    @Path("/context")
    public Response propagateContext(Map<String, String> payload) {
        String user = payload.getOrDefault("user", "Admin_User");
        String role = payload.getOrDefault("role", "ADMIN");
        TaskResult result = contextDemoService.runWithContext(user, role);
        return Response.ok(result).build();
    }
}
