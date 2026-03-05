package tp.jee_presentation_v2.dto;

public class StockPrice {
    public String symbol;
    public double price;
    public double changePercent;
    public boolean isUp;

    public StockPrice(String symbol, double price, double changePercent, boolean isUp) {
        this.symbol = symbol;
        this.price = price;
        this.changePercent = changePercent;
        this.isUp = isUp;
    }
}
