"use client";

import axiosPrivate from "@/axios/axios";
import { useRouter } from "@/i18n/navigation";
import {
  _insertNewAddress,
  _insertNewConsigneeAddress,
  _insertReturnAddress,
  _insertReturnConsigneeAddress,
} from "@/store/slices/geolocationSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { LuSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { _setDefConsigneeOpt } from "@/store/slices/awbsSlice";
import { RootState } from "@/store/store";
import { Address } from "@/store/slices/geolocationSlice";

interface SearchAddressResponse {
  id: string | number;
  view_label: string;
  full_address: string;
  [key: string]: unknown;
}

interface AddressesResponse {
  addresses: SearchAddressResponse[];
}

export default function SearchAddressesModal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(true);
  const addressInsertionType = useSelector(
    (state: RootState) => state?.geolocation?.addressInsertionType
  );
  const returnWizardOpened = useSelector(
    (state: RootState) => state?.awbs?.returnWizardOpened
  );
  const [searchResult, setSearchResult] = useState<SearchAddressResponse[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [emptyResults, setEmptyResults] = useState(false);
  const { handleSubmit } = useForm();
  const t = useTranslations("SearchAddresses");

  const searchForAddresses = useCallback(
    async (signal: AbortSignal) => {
      setSearchLoading(true);
      setEmptyResults(false);
      try {
        const response = await axiosPrivate.get<AddressesResponse>(
          `/filtered-addresses?for_type=${addressInsertionType}&shipping_type=regular&limit=10&pairable=true&has_carriers=true&shipment_direction=${
            returnWizardOpened ? "return" : "shipping"
          }&search=${searchQuery}`,
          { signal }
        );
        setSearchResult(response?.data?.addresses || []);
        if (response?.data?.addresses?.length > 0) {
          setEmptyResults(false);
        } else {
          setEmptyResults(true);
        }
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") {
          console.log(err);
        }
      } finally {
        setSearchLoading(false);
      }
    },
    [searchQuery, addressInsertionType, returnWizardOpened]
  );

  useEffect(() => {
    const controller = new AbortController();

    if (searchQuery.trim()?.length >= 3) {
      const timeoutId = setTimeout(() => {
        searchForAddresses(controller.signal);
      }, 1500);

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    } else {
      setSearchResult([]);
      setEmptyResults(false);
    }

    return () => controller.abort();
  }, [searchQuery, searchForAddresses]);

  const handleClose = useCallback(() => {
    setOpen(false);
    router.back();
  }, [router]);

  const handleAddressSelect = useCallback(
    (address: SearchAddressResponse, e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();

      if (!address || !addressInsertionType) {
        return;
      }

      // Prepare the address object with selected flag for return shipper
      const addressToInsert =
        returnWizardOpened && addressInsertionType === "shipper"
          ? { ...address, selected: true }
          : address;

      if (returnWizardOpened) {
        if (addressInsertionType === "shipper") {
          dispatch(_insertReturnAddress([addressToInsert as Address]));
        } else if (addressInsertionType === "consignee") {
          dispatch(_insertReturnConsigneeAddress([address as Address]));
          dispatch(_setDefConsigneeOpt("consigneeAddress"));
        }
      } else {
        if (addressInsertionType === "shipper") {
          dispatch(_insertNewAddress([address as Address]));
        } else if (addressInsertionType === "consignee") {
          dispatch(_insertNewConsigneeAddress([address as Address]));
        }
      }

      // Small delay to ensure dispatch completes before closing
      setTimeout(() => {
        setOpen(false);
        router?.back();
      }, 100);
    },
    [returnWizardOpened, addressInsertionType, dispatch, router]
  );

  function preventEnter() {
    return;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className={`lg:min-w-3xl ${
          searchResult?.length > 0 ? "max-h-[90vh]" : ""
        }`}
        onInteractOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={handleClose}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {t("modalHeader")}
          </DialogTitle>
        </DialogHeader>
        <div className="px-4">
          <form
            className="flex flex-col gap-2 pb-5 relative"
            noValidate
            onSubmit={handleSubmit(preventEnter)}
          >
            <div className="flex flex-col gap-2 z-9">
              <div className="flex flex-col gap-2">
                <Label htmlFor="search-input">{t("inputLabel")}</Label>
                <div className="relative">
                  <Input
                    id="search-input"
                    size={undefined}
                    placeholder={t("inputPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setEmptyResults(false);
                    }}
                    className="pr-10 bg-neutral-200/20 dark:bg-neutral-800"
                  />
                  <LuSearch
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("inputHelperText")}
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              {searchResult?.length > 0 && (
                <Card className="p-1 dark:bg-gray-700/55">
                  <CardContent className="p-0">
                    <div className="max-h-[300px] overflow-y-auto">
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {t("searchResults")}
                      </div>
                      <div className="space-y-1">
                        {searchResult.map((address) => (
                          <button
                            key={address?.id}
                            type="button"
                            onClick={(e) => handleAddressSelect(address, e)}
                            className="w-full text-left px-2 py-1.5 rounded-sm text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            {address?.view_label} - {address?.full_address}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {emptyResults && searchQuery?.length >= 3 && (
                <Card className="p-1 dark:bg-gray-700/55">
                  <CardContent className="p-0">
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {t("noResults")}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </form>

          {searchLoading && (
            <div className="fixed inset-0 bg-background/70 flex items-center justify-center z-9999">
              <div className="flex flex-col text-center items-center">
                <Spinner className="size-8 text-warning" />
                <p className="text-center font-bold pt-3">{t("searching")}</p>
                <p className="text-muted-foreground text-sm">
                  {t("pleaseWait")}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
