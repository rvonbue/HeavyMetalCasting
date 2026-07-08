import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
import { Button_A, PageContainer } from "../../components/Resuables";
import { HmcSelect } from "../../components/Resuables";

export default function AddProductPage({ productAttributes }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      description: "",
      live: false,
      max_quantity_per_order: 10,
      product_categories: [],
      size_chart: [],
      metal_types: [],
    },
  });

  async function onSubmit(formData) {
    try {
      const newProduct = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        live: formData.live,
        max_quantity_per_order: Number(formData.max_quantity_per_order),
        product_categories: formData.product_categories,
        size_chart: formData.size_chart,
        metal_types: formData.metal_types,
      };

      const { error } = await supabase
        .from("products")
        .insert(newProduct);

      if (error) throw error;

      toast.success("Product added successfully.");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Could not add product.");
    }
  }

  return (
    <PageContainer bg="admin">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-4 rounded border border-hmc-border-a bg-hmc-panelbackground p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-hmc-textprimary">Add Product</h1>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-hmc-textprimary">
            Product Name
          </label>
          <input
            {...register("name", { required: true })}
            className="w-full rounded border border-hmc-border-a px-3 py-2 text-hmc-textprimary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-hmc-textprimary">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: true })}
            className="w-full rounded border border-hmc-border-a px-3 py-2 text-hmc-textprimary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-hmc-textprimary">
            Description
          </label>
          <textarea
            {...register("description")}
            className="h-32 w-full resize-none rounded border border-hmc-border-a px-3 py-2 text-hmc-textprimary"
          />
        </div>

        <Controller
          name="product_categories"
          control={control}
          render={({ field }) => (
            <HmcSelect
              isMulti
              options={(productAttributes?.product_categories ?? []).map((x) => ({
                value: x.id,
                label: x.label,
              }))}
              value={(productAttributes?.product_categories ?? [])
                .filter((x) => field.value.includes(x.id))
                .map((x) => ({ value: x.id, label: x.label }))}
              onChange={(selected) =>
                field.onChange(selected.map((x) => x.value))
              }
              placeholder="Product Categories"
            />
          )}
        />

        <Controller
          name="size_chart"
          control={control}
          render={({ field }) => (
            <HmcSelect
              isMulti
              options={(productAttributes?.size_charts ?? []).map((x) => ({
                value: x.id,
                label: x.label,
              }))}
              value={(productAttributes?.size_charts ?? [])
                .filter((x) => field.value.includes(x.id))
                .map((x) => ({ value: x.id, label: x.label }))}
              onChange={(selected) =>
                field.onChange(selected.map((x) => x.value))
              }
              placeholder="Size Charts"
            />
          )}
        />

        <Controller
          name="metal_types"
          control={control}
          render={({ field }) => (
            <HmcSelect
              isMulti
              options={(productAttributes?.metal_types ?? []).map((x) => ({
                value: x.id,
                label: x.label,
              }))}
              value={(productAttributes?.metal_types ?? [])
                .filter((x) => field.value.includes(x.id))
                .map((x) => ({ value: x.id, label: x.label }))}
              onChange={(selected) =>
                field.onChange(selected.map((x) => x.value))
              }
              placeholder="Metal Types"
            />
          )}
        />

        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-hmc-textprimary">
            Max Quantity Per Order
          </label>
          <input
            type="number"
            {...register("max_quantity_per_order")}
            className="w-full rounded border border-hmc-border-a px-3 py-2 text-hmc-textprimary"
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-bold text-hmc-textprimary">
          <input type="checkbox" {...register("live")} />
          Live
        </label>

        <Button_A
          button_name={isSubmitting ? "Adding..." : "Add Product"}
          button_type="form"
        />
      </form>
    </PageContainer>
  );
}