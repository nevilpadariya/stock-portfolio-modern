import React, { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

interface TradingViewWidgetProps {
  className?: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const muiTheme = useTheme();
  const { darkMode } = useCustomTheme();

  useEffect(() => {
    // Create the widget container
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "width": "100%",
      "height": "660",
      "plotLineColorGrowing": darkMode ? "rgba(82, 175, 255, 1)" : "rgba(33, 150, 243, 1)",
      "plotLineColorFalling": darkMode ? "rgba(82, 175, 255, 1)" : "rgba(33, 150, 243, 1)",
      "gridLineColor": darkMode ? "rgba(42, 46, 57, 1)" : "rgba(233, 233, 234, 1)",
      "scaleFontColor": darkMode ? "rgba(200, 200, 200, 1)" : "rgba(131, 136, 141, 1)",
      "belowLineFillColorGrowing": darkMode ? "rgba(41, 98, 255, 0.12)" : "rgba(5, 122, 205, 0.12)",
      "belowLineFillColorFalling": darkMode ? "rgba(41, 98, 255, 0.12)" : "rgba(5, 122, 205, 0.12)",
      "symbolActiveColor": darkMode ? "rgba(41, 98, 255, 0.2)" : "rgba(225, 239, 249, 1)",
      "backgroundColor": darkMode ? "rgba(18, 18, 18, 1)" : "white",
      "tabs": [
        {
          "title": "Indices",
          "symbols": [
            { "s": "OANDA:SPX500USD", "d": "S&P 500" },
            { "s": "INDEX:XLY0", "d": "Shanghai Composite" },
            { "s": "FOREXCOM:DJI", "d": "Dow 30" },
            { "s": "INDEX:NKY", "d": "Nikkei 225" },
            { "s": "INDEX:DAX", "d": "DAX Index" },
            { "s": "OANDA:UK100GBP", "d": "FTSE 100" }
          ],
          "originalTitle": "Indices"
        },
        {
          "title": "Commodities",
          "symbols": [
            { "s": "CME_MINI:ES1!", "d": "E-Mini S&P" },
            { "s": "CME:E61!", "d": "Euro" },
            { "s": "COMEX:GC1!", "d": "Gold" },
            { "s": "NYMEX:CL1!", "d": "Crude Oil" },
            { "s": "NYMEX:NG1!", "d": "Natural Gas" },
            { "s": "CBOT:ZC1!", "d": "Corn" }
          ],
          "originalTitle": "Commodities"
        },
        {
          "title": "Bonds",
          "symbols": [
            { "s": "CME:GE1!", "d": "Eurodollar" },
            { "s": "CBOT:ZB1!", "d": "T-Bond" },
            { "s": "CBOT:UD1!", "d": "Ultra T-Bond" },
            { "s": "EUREX:GG1!", "d": "Euro Bund" },
            { "s": "EUREX:II1!", "d": "Euro BTP" },
            { "s": "EUREX:HR1!", "d": "Euro BOBL" }
          ],
          "originalTitle": "Bonds"
        },
        {
          "title": "Forex",
          "symbols": [
            { "s": "FX:EURUSD" },
            { "s": "FX:GBPUSD" },
            { "s": "FX:USDJPY" },
            { "s": "FX:USDCHF" },
            { "s": "FX:AUDUSD" },
            { "s": "FX:USDCAD" }
          ],
          "originalTitle": "Forex"
        }
      ]
    });

    // Clear any existing widget first
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      
      // Create widget structure
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container';
      
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      widgetContainer.appendChild(widgetDiv);
      
      // Append the script
      widgetContainer.appendChild(script);
      
      // Add to the DOM
      containerRef.current.appendChild(widgetContainer);
    }

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [darkMode]); // Re-render when dark mode changes

  return (
    <Box 
      ref={containerRef} 
      className={className}
      sx={{
        width: '100%',
        height: '660px',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    />
  );
};

export default TradingViewWidget; 