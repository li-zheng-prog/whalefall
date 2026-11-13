# Whalefall

An aurora and whale glassmorphism background theme for the DeepSeek Harness web UI.

- Follows DeepSeek Harness's light and dark themes.
- Aurora, particle whale and star-grid effects animate with the interface.
- On the home screen the particle whale steps aside while the official home whale plays its dive animation, then reassembles once the official whale has finished.
- The sidebar, composer and some content panels use translucent glass: the left sidebar is a frosted-glass card, the right sidebar is clear glass.
- Tooltips and session / workspace hover cards are themed glass layers, so they no longer show up as dark slabs in the light theme.
- Respects the system reduce-motion setting.

## Preview

### Dark theme

![Whalefall dark theme preview](assets/dark.png)

### Light theme

![Whalefall light theme preview](assets/light.png)

## Installation

Designed for DeepSeek Harness 0.2.x. Clone the repository and run the following from its root:

```powershell
git clone https://github.com/li-zheng-prog/whalefall.git
cd whalefall
dsh plugin --profile desktop add .
```

You can also install this directory through the DeepSeek Harness plugin manager. If the theme does not take effect immediately, reload or restart DeepSeek Harness.

## Notes

The theme depends on DeepSeek Harness's UI structure, so some styles may need adjustment after an upgrade. The particle whale and some aurora effects require WebGL 2.

The home hand-off watches the official home whale canvas, so it needs no fixed animation length. If that canvas is missing or unreadable, the particle whale simply stays visible as before.

## License

[MIT](LICENSE)
