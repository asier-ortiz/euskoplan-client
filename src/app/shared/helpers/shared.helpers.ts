import {MessageService} from "primeng/api";

export function showToast(messageService: MessageService, severity: string, summary: string, detail: string) {
  messageService.add(
    {
      severity: severity,
      summary: summary,
      detail: detail
    }
  );
}
