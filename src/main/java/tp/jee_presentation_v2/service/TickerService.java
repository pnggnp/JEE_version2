package tp.jee_presentation_v2.service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import jakarta.enterprise.concurrent.ManagedScheduledExecutorService;
import jakarta.enterprise.context.ApplicationScoped;
import tp.jee_presentation_v2.dto.StockPrice;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

@ApplicationScoped
public class TickerService {

    @Resource
    private ManagedScheduledExecutorService scheduler;

    private List<StockPrice> latestPrices = new CopyOnWriteArrayList<>();

    public TickerService() {
        latestPrices.add(new StockPrice("AAPL", 189.42, 2.31, true));
        latestPrices.add(new StockPrice("GOOGL", 141.80, -0.45, false));
        latestPrices.add(new StockPrice("MSFT", 378.91, 1.12, true));
    }

    // Usually run by a container in @PostConstruct if managedbean, but CDI might
    // not start it until requested.
    @PostConstruct
    public void startTicker() {
        try {
            if (scheduler != null) {
                scheduler.scheduleAtFixedRate(() -> {
                    for (StockPrice stock : latestPrices) {
                        double variation = (Math.random() - 0.5) * 5;
                        stock.price = Math.max(1, stock.price + variation);
                        stock.changePercent = (variation / stock.price) * 100;
                        stock.isUp = variation >= 0;
                    }
                }, 0, 3, TimeUnit.SECONDS);
            }
        } catch (Exception e) {
            // log error
        }
    }

    public List<StockPrice> getLatestPrices() {
        return new ArrayList<>(latestPrices);
    }

    public void addTicker(String symbol) {
        latestPrices.add(0, new StockPrice(symbol.toUpperCase(), Math.random() * 500, 0, true));
    }
}
