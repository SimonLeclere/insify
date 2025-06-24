import { UseFloatingOptions } from "@floating-ui/react";
import { FC, CSSProperties, useMemo, useRef, useState, useEffect } from "react";
import { useBlockNoteEditor } from "@blocknote/react";
import { FormattingToolbar } from "@blocknote/react";
import { FormattingToolbarProps } from "@blocknote/react";

function useUIPluginState<State>(
  onUpdate: (callback: (state: State) => void) => void
): State | undefined {
  const [state, setState] = useState<State>();

  useEffect(() => {
    return onUpdate((state) => {
      setState({ ...state });
    });
  }, [onUpdate]);

  return state;
}


/**
 * Experimental formatting toolbar controller for mobile devices.
 * Uses Visual Viewport API to position the toolbar above the virtual keyboard.
 *
 * Currently marked experimental due to the flickering issue with positioning cause by the use of the API (and likely a delay in its updates).
 */
export const MobileToolbar = (props: {
  formattingToolbar?: FC<FormattingToolbarProps>;
  floatingOptions?: Partial<UseFloatingOptions>;
}) => {
  const [transform, setTransform] = useState<string>("none");
  const divRef = useRef<HTMLDivElement>(null);
  const editor = useBlockNoteEditor();
  const state = useUIPluginState(
    editor.formattingToolbar.onUpdate.bind(editor.formattingToolbar),
  );

  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    const unsub = editor.onSelectionChange(() => {
      const selection = editor.getSelection();
      setShowToolbar(!!(selection && selection.blocks.length > 0));
    });
    // Initialize on mount
    const sel0 = editor.getSelection();
    setShowToolbar(!!(sel0 && sel0.blocks.length > 0));
    return () => unsub?.();
  }, [editor]);

  const style = useMemo<CSSProperties>(() => {
    return {
      display: "flex",
      justifyContent: "center",
      position: "fixed",
      bottom: 0,
      zIndex: 3000,
      transform,
      width: "100%",
      maxWidth: "100%",
      left: 0,
      padding: "0.5rem",
      boxSizing: "border-box",
    };
  }, [transform]);

  useEffect(() => {
    const viewport = window.visualViewport!;
    function viewportHandler() {
      // Calculate the offset necessary to set the toolbar above the virtual keyboard (using the offset info from the visualViewport)
      const layoutViewport = document.body;
      const offsetLeft = viewport.offsetLeft;
      const offsetTop =
        viewport.height -
        layoutViewport.getBoundingClientRect().height +
        viewport.offsetTop;

      setTransform(
        `translate(${offsetLeft}px, ${offsetTop}px) scale(${
          1 / viewport.scale
        })`,
      );
    }
    window.visualViewport!.addEventListener("scroll", viewportHandler);
    window.visualViewport!.addEventListener("resize", viewportHandler);
    viewportHandler();

    return () => {
      window.visualViewport!.removeEventListener("scroll", viewportHandler);
      window.visualViewport!.removeEventListener("resize", viewportHandler);
    };
  }, []);

  if (!state || !showToolbar) {
    return null;
  }

  if (!state.show && divRef.current) {
    // The component is fading out. Use the previous state to render the toolbar with innerHTML,
    // because otherwise the toolbar will quickly flickr (i.e.: show a different state) while fading out,
    // which looks weird
    return (
      <div
        ref={divRef}
        style={style}
        onMouseDown={(e) => e.preventDefault()}
        dangerouslySetInnerHTML={{ __html: divRef.current.innerHTML }}
      ></div>
    );
  }

  const Component = props.formattingToolbar || FormattingToolbar;

  return (
    <div ref={divRef} style={style} onMouseDown={(e) => e.preventDefault()}>
      <Component />
    </div>
  );
};