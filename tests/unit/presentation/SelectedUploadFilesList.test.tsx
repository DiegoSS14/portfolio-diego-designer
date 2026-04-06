import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { SelectedUploadFilesList } from "@/modules/portfolio/presentation/components/SelectedUploadFilesList";

describe("SelectedUploadFilesList", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows previews and supports drag and drop reordering", () => {
    const onRemove = jest.fn();
    const onMove = jest.fn();
    const firstFile = new File(["first"], "first-image.png", { type: "image/png" });
    const secondFile = new File(["second"], "second-image.png", { type: "image/png" });

    render(
      <SelectedUploadFilesList files={[firstFile, secondFile]} onRemove={onRemove} onMove={onMove} />,
    );

    expect(screen.getByAltText("Preview de first-image.png")).toBeInTheDocument();
    expect(screen.getByAltText("Preview de second-image.png")).toBeInTheDocument();

    const firstItem = screen.getByText("first-image.png").closest("li");
    const secondItem = screen.getByText("second-image.png").closest("li");

    expect(firstItem).not.toBeNull();
    expect(secondItem).not.toBeNull();

    fireEvent.dragStart(firstItem as Element);
    fireEvent.dragOver(secondItem as Element);
    fireEvent.drop(secondItem as Element);

    expect(onMove).toHaveBeenCalledWith(0, 1);
  });
});
