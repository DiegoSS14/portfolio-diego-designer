import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { ReorderableMediaList } from "@/modules/portfolio/presentation/components/ReorderableMediaList";

describe("ReorderableMediaList", () => {
  it("supports drag and drop and move buttons", () => {
    const onRemove = jest.fn();
    const onMove = jest.fn();

    render(
      <ReorderableMediaList
        items={[
          { id: "1", label: "Imagem atual 1", previewUrl: "/img-1.webp" },
          { id: "2", label: "Imagem atual 2", previewUrl: "/img-2.webp" },
        ]}
        onRemove={onRemove}
        onMove={onMove}
      />,
    );

    expect(screen.queryByAltText("Imagem atual 1")).not.toBeNull();
    expect(screen.queryByAltText("Imagem atual 2")).not.toBeNull();

    const firstItem = screen.getByAltText("Imagem atual 1").closest("li");
    const secondItem = screen.getByAltText("Imagem atual 2").closest("li");

    fireEvent.dragStart(firstItem as Element);
    fireEvent.dragOver(secondItem as Element);
    fireEvent.drop(secondItem as Element);

    expect(onMove).toHaveBeenCalledWith(0, 1);

    fireEvent.click(screen.getByRole("button", { name: /mover imagem atual 2 para cima/i }));
    expect(onMove).toHaveBeenCalledWith(1, 0);

    fireEvent.click(screen.getByRole("button", { name: /remover imagem atual 1/i }));
    expect(onRemove).toHaveBeenCalledWith(0);
  });
});
